import type { Ctor, Mixin } from "../type"
import { composeMixin } from "../mixin"
import { Activatable, IncrementalSpecial, Special, Tagged, Timestamped, User } from "../mock/UserMixin"
import type { WithSpecial } from "../mock/UserMixin"
import { Num, sort } from "../mock/NumberMixin"

const FIXED_SYSTEM_TIME = Date.now()
// to avoid race conditions between expected and actual date values
beforeAll(() => {
  jest.useFakeTimers("modern") // tell Jest to use a different timer implementation.
  jest.setSystemTime(FIXED_SYSTEM_TIME)
})

afterAll(() => {
  // Back to reality...
  jest.useRealTimers()
})

it("Should reflect fixed date", () => {
  expect(Date.now()).toEqual(FIXED_SYSTEM_TIME)
})

const USER_NAME = "Bobby"

const getTestUser = <T extends User>(Class: Ctor<T>): T => {
  const user = new Class(USER_NAME)
  expect(user.name).toEqual(USER_NAME)
  return user
}

describe("Mixin basics", () => {
  it("Should create a class expression", () => {
    const TimestampedUser = Timestamped(User)

    const user = getTestUser(TimestampedUser)
    expect(user.timestamp).toEqual(FIXED_SYSTEM_TIME)
  })

  it("Should create a class expression with a constructor", () => {
    const TaggedUser = Tagged(User)

    const user = getTestUser(TaggedUser)
    expect(user.tag).toEqual(null)
    user.tag = "Tagged!"
    expect(user.tag).toEqual("Tagged!")
  })

  it("Should create a class expression with methods", () => {
    const ActivatableUser = Activatable(User)

    const user = getTestUser(ActivatableUser)
    expect(user.isActivated).toEqual(false)
    user.toggleOnOff()
    expect(user.isActivated).toEqual(true)
    user.toggleOnOff()
    expect(user.isActivated).toEqual(false)
  })
})

describe("Mixin composition", () => {
  const SpecialUser = Special(User)

  const testMatchSpecialUser = (user: any, specialUser: User & WithSpecial): void =>
    expect(user).toMatchObject<User & WithSpecial>(specialUser)

  type SpecialUserObject = User & Omit<WithSpecial, "toggleOnOff">
  const mockSpecialUser: SpecialUserObject = {
    name: USER_NAME,
    timestamp: FIXED_SYSTEM_TIME,
    tag: null,
    isActivated: false,
  }

  it("Should use composition to create a class expression with static types", () => {
    const user = getTestUser(SpecialUser)
    for (const prop in user) {
      expect(user[prop]).toEqual(mockSpecialUser[prop as keyof SpecialUserObject])
    }
  })

  it("Should use incremental composition to create a class expression", () => {
    const TimestampedUser = Timestamped(User)
    const IncSpecialUser = IncrementalSpecial(Tagged(TimestampedUser))

    testMatchSpecialUser(getTestUser(IncSpecialUser), getTestUser(SpecialUser))
  })

  it("Should use factory composition to create a class expression", () => {
    const mixins = [Timestamped, Tagged, Activatable]
    const UserComposed = composeMixin<typeof User, typeof mixins>(User, ...mixins)
    testMatchSpecialUser(getTestUser(UserComposed), getTestUser(SpecialUser))
  })
})

describe("Mixin advanced", () => {
  it("Should create a class expression whose instances can be used in other functions", () => {
    const number1 = new Num(40)
    const number2 = new Num(20)
    expect(sort([number1, number2])).toEqual([number2, number1])
  })
})
